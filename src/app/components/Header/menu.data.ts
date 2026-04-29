import PageConfig from '@/app/config/page.config'

export interface INavItem {
    name: string,
    url: string
}

export const navBarPath: INavItem[] = [
    {
        name: 'Oferta',
        url: PageConfig.OFFER
    },
    {
        name: "Ksiegowości",
        url: PageConfig.ACCOUNTING
    },
    {
        name: "Kontakt",
        url: PageConfig.CONTACT
    },
    {
        name: "Sklep z usługami",
        url: PageConfig.STORE_LINK
    }
]

export const navBarAdmin: INavItem[] = [
    {
        name: "Admin",
        url: PageConfig.ADMIN
    }
]