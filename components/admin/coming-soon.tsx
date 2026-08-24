/** מסך זמני למודולים שעוד לא נבנו */
export function ComingSoon({ title, phase }: { title: string; phase: string }) {
  return (
    <>
      <h1 className="text-h2">{title}</h1>
      <div className="mt-8 rounded-lg border border-stroke bg-white p-10 text-center">
        <p className="text-h3">בבנייה</p>
        <p className="text-body text-textgray mt-2">{phase}</p>
      </div>
    </>
  );
}
