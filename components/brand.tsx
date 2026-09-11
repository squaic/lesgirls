import Link from "next/link";
export function Brand({small=false}:{small?:boolean}) { return <Link href="/" className={`serif font-bold tracking-[-.04em] ${small?"text-2xl":"text-[34px]"}`}>Les Girl<span className="text-[#e84b72]">z</span><i className="ml-1 inline-block h-2 w-2 rounded-full bg-[#e84b72] align-top"/></Link>; }
