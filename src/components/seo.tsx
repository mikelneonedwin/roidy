import { Helmet } from "react-helmet-async";

const Seo = ({ title }: SEOProps) => {
    return (
        <Helmet>
            {title && <title>{title}</title>}
        </Helmet>
    );
}

export default Seo;