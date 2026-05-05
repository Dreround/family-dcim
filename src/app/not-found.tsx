import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="rounded-[28px] border border-white/70 bg-white/80 p-10 text-center shadow-paper">
      <h1 className="font-serif text-3xl text-moss">页面不存在</h1>
      <p className="mt-3 text-sm leading-7 text-clay">你访问的内容可能已经被删除，或者链接地址不正确。</p>
      <Link href="/" className="mt-5 inline-flex rounded-2xl bg-moss px-4 py-3 text-sm font-medium text-white">
        返回首页
      </Link>
    </div>
  );
}
