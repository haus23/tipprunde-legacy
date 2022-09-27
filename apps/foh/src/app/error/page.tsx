export default function ErrorPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-y-4 rounded-md bg-white p-4 shadow-md">
        <h2 className="px-4 text-3xl font-semibold text-red-500">Hoppla!</h2>
        <hr />
        <div className="px-4 text-lg">
          <p>
            Hier lief was schief. Sag uns Bescheid und wir versuchen den Fehler
            zu finden.
          </p>
          <p>Oder hast du aus Versehen ein falsches Turnier eingegeben?</p>
        </div>
      </div>
    </div>
  );
}
