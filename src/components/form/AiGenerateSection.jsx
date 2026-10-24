export function AiGenerateSection({ onGenerate, generating, statusMessage, statusType }) {
  return (
    <section className="space-y-4 p-4 rounded-xl border-2 border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Генерация</h2>

      <button
        type="button"
        onClick={onGenerate}
        disabled={generating}
        className="w-full min-h-11 px-5 rounded-lg bg-indigo-600 text-white font-medium disabled:opacity-60"
      >
        {generating ? 'Генерация…' : 'Сгенерировать описание'}
      </button>

      {statusMessage && (
        <p
          role="alert"
          className={`text-sm rounded-lg px-3 py-2 ${
            statusType === 'error'
              ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200'
              : statusType === 'success'
                ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200'
                : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
          }`}
        >
          {statusMessage}
        </p>
      )}
    </section>
  )
}
