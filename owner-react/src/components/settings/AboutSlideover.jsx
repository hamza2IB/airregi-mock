import Slideover from '../Slideover'
import Icon from '../Icon'

function Content({ data, onClose }) {
  return (
    <>
      <div className="px-6 py-5 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${data.iconWrap}`}>
            <Icon name={data.icon} style={{ fontSize: '18px' }} />
          </div>
          <div>
            <h3 className="text-[16px] font-extrabold text-navy-dark leading-tight">{data.title}</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">{data.subtitle}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
          <Icon name="close-outline" style={{ fontSize: '20px' }} />
        </button>
      </div>

      <div className="p-6 space-y-6 text-[13px] text-gray-600 leading-relaxed pb-8">
        <div className={`rounded-xl border px-4 py-3 flex items-start gap-3 ${data.intro.bg}`}>
          <Icon name={data.intro.icon} className={`${data.intro.color} shrink-0 mt-0.5`} style={{ fontSize: '16px' }} />
          <p className="text-[11px] text-navy-dark">{data.intro.text}</p>
        </div>

        {data.sections.map((s, i) => (
          <section key={i}>
            <h4 className="text-[13px] font-bold text-navy-dark mb-2">{s.heading}</h4>
            {s.body?.map((p, j) => <p key={j} className={s.list || s.ordered ? 'mb-2' : ''}>{p}</p>)}
            {s.list && (
              <ul className="space-y-1.5 pl-4 list-disc marker:text-gray-300">
                {s.list.map((li, j) => <li key={j}>{li}</li>)}
              </ul>
            )}
            {s.ordered && (
              <ol className="space-y-1.5 pl-4 list-decimal marker:text-gray-400 marker:text-[11px]">
                {s.ordered.map((li, j) => <li key={j}>{li}</li>)}
              </ol>
            )}
          </section>
        ))}

        <div className="border-t border-border pt-4 text-[11px] text-gray-400">
          <p>{data.footer}</p>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-border px-6 py-4">
        <button onClick={onClose} className="w-full py-2.5 bg-navy text-white rounded-xl text-[13px] font-semibold hover:bg-navy-light transition">Close</button>
      </div>
    </>
  )
}

export default function AboutSlideover({ data, onClose }) {
  return <Slideover item={data} onClose={onClose} width={560} render={(d) => <Content data={d} onClose={onClose} />} />
}
