import { Helmet } from "react-helmet-async";

const Seo = ({ title }: SEOProps) => {
    return (
        <Helmet>
            {title && <title>Roidy - {title}</title>}
        </Helmet>
    );
}

export default Seo;