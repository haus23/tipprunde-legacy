// Placeholder row for a table without entries, e.g. a round without matches.
export default function EmptyTableRow({
  children,
  colSpan,
}: {
  children: React.ReactNode;
  colSpan: number;
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-4 py-6 text-center text-muted-foreground text-sm sm:px-6"
      >
        {children}
      </td>
    </tr>
  );
}
