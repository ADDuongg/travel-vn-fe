import { cn } from './utils';

describe('cn', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    const hidden = false;
    const visible = true;
    expect(cn('base', hidden && 'hidden', visible && 'visible')).toBe(
      'base visible',
    );
  });

  it('merges tailwind classes with conflicts', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });
});
