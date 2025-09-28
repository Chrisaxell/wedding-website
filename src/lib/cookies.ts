import { cookies as nextCookies } from "next/headers";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

// Small adapter to work with Next 14 (sync) and 15 (async)
async function getJar(): Promise<ReadonlyRequestCookies> {
    const maybe = (nextCookies as unknown as () => ReadonlyRequestCookies | Promise<ReadonlyRequestCookies>)();
    return Promise.resolve(maybe);
}

export async function getCookie(name: string): Promise<string | undefined> {
    try {
        const jar = await getJar();
        return jar.get(name)?.value;
    } catch {
        // If called from a client component or unsupported context, it will fail
        return undefined;
    }
}

/**
 * Note: Setting cookies is only allowed in **Route Handlers** or **Server Actions**,
 * not during Server Component render. Make sure callers respect that.
 */
export async function deleteCookie(name: string) {
    const jar = await getJar();
    jar.set({
        name,
        value: "",
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        maxAge: 0,
    });
}
