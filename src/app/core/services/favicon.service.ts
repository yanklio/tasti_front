import { Injectable } from "@angular/core";


@Injectable({
    providedIn: "root"
})
export class FaviconService {
    setFavicon(iconUrl: string): void {
        let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");

        if (!link) {
            link = document.createElement("link");
            link.id = 'appFavicon';
            link.rel = 'icon';
            document.head.appendChild(link);
        }

        link.href = iconUrl;
    }

    setFaviconByTheme(lightIconUrl: string, darkIconUrl: string): void {
        const matcher = window.matchMedia('(prefers-color-scheme: dark)');
        const applyTheme = (event?: MediaQueryListEvent) => {
            this.setFavicon(event?.matches ? darkIconUrl : lightIconUrl);
        };

        applyTheme();
        matcher.addEventListener('change', applyTheme);
    }
}