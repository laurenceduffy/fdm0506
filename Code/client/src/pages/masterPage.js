import AppNavbar from './../Navbar';
import Footer from './../Footer';

const MasterPage = ({page}) => {
    const Content = page;

    return (
        <>
            <AppNavbar />
            <Content />
        </>
    )
}

export default MasterPage;