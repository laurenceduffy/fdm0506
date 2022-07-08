import { Footer as BulmaFooter, Container, Content } from "react-bulma-components";

const Footer = () => {
    return (
        <>
            <BulmaFooter>
                <Container>
                    <Content style={{ textAlign: 'center' }}>
                        <p>
                            <strong>Simtrade</strong> by{' '}
                            <a href="https://laurenceduffy.dev/">Laurence Duffy</a>.

                            Built with{' '}
                            <a href="https://reactjs.org/">React</a>
                            {' '}and{' '}
                            <a href="https://bulma.io/">Bulma</a>.
                        </p>
                    </Content>
                </Container>
            </BulmaFooter>
        </>
    );
}

export default Footer;