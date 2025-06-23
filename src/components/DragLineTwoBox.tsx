import React, {
  useRef,
  useState,
  RefObject,
  useEffect,
  useCallback,
} from 'react';

// Kiểu dữ liệu cho item và match
type MatchItem = { id: string; label: string };
type MatchPair = { a: string; b: string };
type DraggingState =
  | { from: 'a'; idx: number; start: { x: number; y: number } }
  | { from: 'b'; idx: number; start: { x: number; y: number } }
  | null;

type Pos = { x: number; y: number } | null;

const itemsA: MatchItem[] = [
  { id: 'a1', label: 'Dog' },
  { id: 'a2', label: 'Cat' },
  { id: 'a3', label: 'Horse' },
];
const itemsB: MatchItem[] = [
  { id: 'b1', label: 'Chó' },
  { id: 'b2', label: 'Mèo' },
  { id: 'b3', label: 'Ngựa' },
];
const correctAnswer: MatchPair[] = [
  { a: 'a1', b: 'b1' },
  { a: 'a2', b: 'b2' },
  { a: 'a3', b: 'b3' },
];

const DragLineTwoBox: React.FC = () => {
  // Ref tới từng div của A/B và svg overlay
  const refsA = useRef<RefObject<HTMLDivElement>[]>(
    itemsA.map(() => React.createRef<HTMLDivElement>()),
  );
  const refsB = useRef<RefObject<HTMLDivElement>[]>(
    itemsB.map(() => React.createRef<HTMLDivElement>()),
  );
  const svgRef = useRef<SVGSVGElement>(null);

  const [matches, setMatches] = useState<MatchPair[]>([]);
  const [dragging, setDragging] = useState<DraggingState>(null);
  const [currentPos, setCurrentPos] = useState<Pos>(null);
  /* useEffect(() => {
    setMatches([
      { a: 'a1', b: 'b3' },
      { a: 'a2', b: 'b2' },
    ]);
  }, []); */
  // Lấy toạ độ bên phải của box A (vào viền phải)
  function getRightCenter(ref: RefObject<HTMLDivElement>) {
    if (!ref.current || !svgRef.current) return { x: 0, y: 0 };
    const rect = ref.current.getBoundingClientRect();
    const svgRect = svgRef.current.getBoundingClientRect();
    return {
      x: rect.left - svgRect.left + rect.width - 2,
      y: rect.top - svgRect.top + rect.height / 2,
    };
  }
  // Lấy toạ độ bên trái của box B (vào viền trái)
  function getLeftCenter(ref: RefObject<HTMLDivElement>) {
    if (!ref.current || !svgRef.current) return { x: 0, y: 0 };
    const rect = ref.current.getBoundingClientRect();
    const svgRect = svgRef.current.getBoundingClientRect();
    return {
      x: rect.left - svgRect.left + 2,
      y: rect.top - svgRect.top + rect.height / 2,
    };
  }
  // Lấy center của box (dùng cho drag start)
  function getCenter(ref: RefObject<HTMLDivElement>) {
    if (!ref.current || !svgRef.current) return { x: 0, y: 0 };
    const rect = ref.current.getBoundingClientRect();
    const svgRect = svgRef.current.getBoundingClientRect();
    return {
      x: rect.left - svgRect.left + rect.width / 2,
      y: rect.top - svgRect.top + rect.height / 2,
    };
  }

  // Bắt đầu kéo
  function handleStart(from: 'a' | 'b', idx: number, e: React.MouseEvent) {
    e.preventDefault();
    const ref = from === 'a' ? refsA.current[idx] : refsB.current[idx];
    const start = getCenter(ref);
    setDragging({ from, idx, start });
    setCurrentPos({ x: start.x, y: start.y });

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  }

  const handleMove = useCallback(
    (e: MouseEvent) => {
      console.log('move trigger');
      if (!svgRef.current) return;
      setCurrentPos({
        x: e.clientX - svgRef.current.getBoundingClientRect().left,
        y: e.clientY - svgRef.current.getBoundingClientRect().top,
      });
    },
    [dragging, matches, itemsA, itemsB, refsA, refsB],
  );

  const handleUp = useCallback(
    (e: MouseEvent) => {
      console.log('up trigger');

      if (!dragging) return;
      const { from, idx } = dragging;
      let refs: RefObject<HTMLDivElement>[];
      if (from === 'a') refs = refsB.current;
      else refs = refsA.current;

      const foundIdx = refs.findIndex((ref) => {
        if (!ref.current) return false;
        const r = ref.current.getBoundingClientRect();
        return (
          e.clientX >= r.left &&
          e.clientX <= r.right &&
          e.clientY >= r.top &&
          e.clientY <= r.bottom
        );
      });

      if (foundIdx >= 0) {
        const a = from === 'a' ? itemsA[idx].id : itemsA[foundIdx].id;
        const b = from === 'a' ? itemsB[foundIdx].id : itemsB[idx].id;
        if (!matches.find((m) => m.a === a || m.b === b)) {
          setMatches((prev) => [...prev, { a, b }]);
        }
      }
      setDragging(null);
      setCurrentPos(null);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    },
    [dragging, matches, itemsA, itemsB, refsA, refsB],
  );

  // Tính toạ độ hai đầu line giữa A và B
  function getLineCoords(aId: string, bId: string) {
    const idxA = itemsA.findIndex((i) => i.id === aId);
    const idxB = itemsB.findIndex((i) => i.id === bId);
    const cA = getRightCenter(refsA.current[idxA]);
    const cB = getLeftCenter(refsB.current[idxB]);
    return { x1: cA.x, y1: cA.y, x2: cB.x, y2: cB.y };
  }

  // Line đang kéo
  let dragLine: React.ReactNode = null;
  if (dragging && currentPos) {
    if (dragging.from === 'a') {
      const { x, y } = getRightCenter(refsA.current[dragging.idx]);
      dragLine = (
        <line
          x1={x}
          y1={y}
          x2={currentPos.x}
          y2={currentPos.y}
          stroke="#1890ff"
          strokeWidth={3}
          strokeDasharray="8 3"
        />
      );
    } else if (dragging.from === 'b') {
      const { x, y } = getLeftCenter(refsB.current[dragging.idx]);
      dragLine = (
        <line
          x1={currentPos.x}
          y1={currentPos.y}
          x2={x}
          y2={y}
          stroke="#1890ff"
          strokeWidth={3}
          strokeDasharray="8 3"
        />
      );
    }
  }

  return (
    <div style={{ width: 520, margin: '40px auto', position: 'relative' }}>
      <svg
        ref={svgRef}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: 240,
          pointerEvents: 'none',
        }}
      >
        {/* Line đã nối */}
        {matches.map(({ a, b }, i) => {
          const { x1, y1, x2, y2 } = getLineCoords(a, b);
          const isCorrect = !!correctAnswer.find((c) => c.a === a && c.b === b);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isCorrect ? '#52c41a' : '#ff4d4f'} // Xanh đúng, đỏ sai
              strokeWidth={3}
            />
          );
        })}

        {/* Line đang kéo */}
        {dragLine}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          {itemsA.map((item, idx) => {
            const match = matches.find((m) => m.b === item.id);
            return (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  ref={refsA.current[idx]}
                  key={item.id}
                  style={{
                    padding: '16px 24px',
                    margin: '16px 0',
                    border: '1.5px solid #aaa',
                    borderRadius: 8,
                    background: '#fff',
                    cursor: 'grab',
                    userSelect: 'none',
                    color: 'black',
                    opacity:
                      matches.find((m) => m.a === item.id) ||
                      (dragging &&
                        dragging.from === 'a' &&
                        dragging.idx === idx)
                        ? 0.5
                        : 1,
                  }}
                  onMouseDown={
                    matches.find((m) => m.a === item.id)
                      ? undefined
                      : (e: React.MouseEvent) => handleStart('a', idx, e)
                  }
                >
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
        <div>
          {itemsB.map((item, idx) => {
            const match = matches.find((m) => m.b === item.id);
            // Xác định đúng/sai
            let icon = null;
            if (match) {
              const isCorrect = correctAnswer.some(
                (c) => c.a === match.a && c.b === match.b,
              );
              icon = isCorrect ? (
                <span style={{ color: '#52c41a', marginLeft: 4, fontSize: 18 }}>
                  ✅
                </span>
              ) : (
                <span style={{ color: '#ff4d4f', marginLeft: 4, fontSize: 18 }}>
                  ❌
                </span>
              );
            }
            return (
              <div
                style={{ display: 'flex', alignItems: 'center' }}
                key={item.id}
              >
                <div
                  ref={refsB.current[idx]}
                  style={{
                    padding: '16px 24px',
                    margin: '16px 0',
                    border: '1.5px solid #aaa',
                    borderRadius: 8,
                    background: '#fff',
                    color: 'black',
                    cursor: 'grab',
                    userSelect: 'none',
                    opacity:
                      match ||
                      (dragging &&
                        dragging.from === 'b' &&
                        dragging.idx === idx)
                        ? 0.5
                        : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}
                  onMouseDown={
                    match
                      ? undefined
                      : (e: React.MouseEvent) => {
                          handleStart('b', idx, e);
                          console.log('1232');
                        }
                  }
                >
                  <span>{item.label}</span>
                </div>
                {match && (
                  <>
                    <button
                      style={{
                        marginLeft: 8,
                        padding: '2px 8px',
                        background: '#ff7875',
                        border: 'none',
                        color: '#fff',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: 13,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setMatches((prev) =>
                          prev.filter((m) => m.b !== item.id),
                        );
                      }}
                    >
                      Xóa
                    </button>
                    {icon}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ marginTop: 16, fontSize: 14, color: '#888' }}>
        Kéo giữ từ 1 mục ở cột trái hoặc phải rồi thả sang mục đối diện để nối.
      </div>
      <pre style={{ fontSize: 12 }}>{JSON.stringify(matches, null, 2)}</pre>
    </div>
  );
};

export default DragLineTwoBox;
