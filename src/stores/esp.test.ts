import { describe, it, expect } from 'vitest'
import { parsePartitions } from './esp'

function makeEntry(name: string, type: number, subtype: number, offset: number, size: number): Uint8Array {
  const entry = new Uint8Array(32)
  const view = new DataView(entry.buffer)
  entry[0] = 0xaa
  entry[1] = 0x50
  entry[2] = type
  entry[3] = subtype
  view.setUint32(4, offset, true)
  view.setUint32(8, size, true)
  const nameBytes = new TextEncoder().encode(name)
  entry.set(nameBytes.slice(0, 16), 12)
  return entry
}

function concat(...arrays: Uint8Array[]): Uint8Array {
  const result = new Uint8Array(arrays.reduce((sum, a) => sum + a.length, 0))
  let offset = 0
  for (const a of arrays) {
    result.set(a, offset)
    offset += a.length
  }
  return result
}

describe('parsePartitions', () => {
  it('parses a single partition', () => {
    const data = makeEntry('nvs', 1, 0x02, 0x9000, 0x6000)
    const result = parsePartitions(data)
    expect(result).toEqual([
      { name: 'nvs', type: 1, subtype: 0x02, offset: 0x9000, size: 0x6000 }
    ])
  })

  it('parses multiple partitions', () => {
    const data = concat(
      makeEntry('nvs', 1, 0x02, 0x9000, 0x6000),
      makeEntry('factory', 0, 0x00, 0x10000, 0x100000)
    )
    const result = parsePartitions(data)
    expect(result).toHaveLength(2)
    expect(result[0]?.name).toBe('nvs')
    expect(result[1]?.name).toBe('factory')
  })

  it('stops at MD5 marker', () => {
    const md5Marker = new Uint8Array(32)
    md5Marker[0] = 0xeb
    md5Marker[1] = 0xeb
    const data = concat(makeEntry('nvs', 1, 0x02, 0x9000, 0x6000), md5Marker)
    const result = parsePartitions(data)
    expect(result).toHaveLength(1)
  })

  it('stops at invalid magic', () => {
    const invalid = new Uint8Array(32)
    const data = concat(makeEntry('nvs', 1, 0x02, 0x9000, 0x6000), invalid)
    const result = parsePartitions(data)
    expect(result).toHaveLength(1)
  })

  it('returns empty for empty data', () => {
    expect(parsePartitions(new Uint8Array(0))).toEqual([])
  })

  it('truncates name at null byte', () => {
    const data = makeEntry('app\0garbage', 0, 0, 0x10000, 0x1000)
    const result = parsePartitions(data)
    expect(result[0]?.name).toBe('app')
  })
})
