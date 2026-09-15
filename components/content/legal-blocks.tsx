import type { LegalBlock } from "@/app/legal/content";

/** מציג את גופי הטקסט של מסמך משפטי · פסקאות, רשימות, טבלה, שדות לחתימה ופרטי קשר. */
export function LegalBlocks({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return (
              <p key={i} className="text-body text-textgray">
                {b.text}
              </p>
            );

          case "ul":
            return (
              <ul key={i} className="text-body text-textgray list-disc space-y-2 ps-5">
                {b.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );

          case "table":
            return (
              <div key={i} className="overflow-x-auto">
                <table className="text-body w-full border-collapse">
                  <thead>
                    <tr className="border-b border-black">
                      {b.head.map((h) => (
                        <th key={h} className="text-button py-3 pe-6 text-start font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((cells, r) => (
                      <tr key={r} className="border-b border-stroke">
                        {cells.map((cell, c) => (
                          <td
                            key={c}
                            className={
                              c === 0
                                ? "py-3 pe-6 align-top text-black"
                                : "text-textgray py-3 pe-6 align-top last:pe-0"
                            }
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "contact":
            return (
              <dl key={i} className="text-body space-y-2">
                {b.items.map((c) => (
                  <div key={c.label} className="flex flex-wrap gap-x-3">
                    <dt className="text-textgray">{c.label}</dt>
                    <dd>
                      {c.href ? (
                        <a
                          href={c.href}
                          dir="ltr"
                          className="ease-smooth underline underline-offset-4 transition-colors hover:text-textgray"
                          {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          {c.value}
                        </a>
                      ) : (
                        c.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            );
        }
      })}
    </>
  );
}
