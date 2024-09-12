declare module 'astro:env/client' {
	export const SITE_URL: string;	
export const PLAUSIBLE_SCRIPT_URL: string | undefined;	

}

declare module 'astro:env/server' {
	export const NODE_ENV: string;	
export const PREVIEW_MODE: boolean;	


	export const getSecret: (key: string) => string | undefined;
}
