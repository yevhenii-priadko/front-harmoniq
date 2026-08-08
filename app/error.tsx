"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h1>Щось пішло не так</h1>
      <button onClick={() => reset()}>Спробувати ще раз</button>
    </div>
  );
}
