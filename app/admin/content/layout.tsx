import { ContentNav } from "@/components/admin/content-nav";

export const metadata = { title: "תוכן ומחירים" };

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ContentNav />
      <div className="mt-6">{children}</div>
    </>
  );
}
