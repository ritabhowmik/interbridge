export default function Badge({ status }: { status: "blocked" | "clear" }) {
  return (
    <span className={`badge lowercase-copy ${status === "blocked" ? "badge-blocked" : "badge-clear"}`}>
      {status === "blocked" ? "blocked" : "clear"}
    </span>
  );
}
