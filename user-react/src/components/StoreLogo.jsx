export default function StoreLogo({ b, size = 52 }) {
  return (
    <div
      className="rounded-2xl flex items-center justify-center font-extrabold text-white shrink-0"
      style={{ width: size, height: size, background: b.color, fontSize: size * 0.36 }}
    >
      {b.initials}
    </div>
  )
}
