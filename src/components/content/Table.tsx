interface TableProps {
  headers: string[];
  rows: string[][];
  caption?: string;
}

export function Table({ headers, rows, caption }: TableProps) {
  return (
    <figure className="my-8 overflow-hidden rounded-lg border border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {caption && (
            <caption className="border-b border-border bg-bg-subtle px-4 py-3 text-left text-sm font-medium text-fg">
              {caption}
            </caption>
          )}
          <thead className="bg-bg-subtle">
            <tr>
              {headers.map((header, i) => (
                <th
                  key={i}
                  scope="col"
                  className="border-b border-border px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-fg-muted"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-border last:border-b-0">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-3 text-fg">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
