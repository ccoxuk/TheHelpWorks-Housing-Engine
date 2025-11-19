import styled from 'styled-components';
import { Drawer, Button, EngineDemo } from './components';

const AppContainer = styled.div`
  padding: 40px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.h1`
  color: #333;
  margin-bottom: 20px;
`;

const Description = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  color: #444;
  margin-bottom: 15px;
`;

function App() {
  const handleButtonClick = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Button clicked!');
  };

  return (
    <AppContainer>
      <Header>TheHelpWorks Housing Engine</Header>
      <Description>
        Providing assistance and creating ownership for those at risk of losing their home.
      </Description>

      <Section>
        <SectionTitle>Extensible Components Demo</SectionTitle>
        <Description>
          This application demonstrates extensible styled-components with custom hooks
          for button handling and drawer interactions.
        </Description>
      </Section>

      <Section>
        <SectionTitle>Button with Custom Hook Handler</SectionTitle>
        <Button onClick={handleButtonClick}>
          Click Me
        </Button>
        {' '}
        <Button variant="secondary" onClick={handleButtonClick}>
          Secondary Button
        </Button>
      </Section>

      <Section>
        <SectionTitle>Drawer Component with Interaction</SectionTitle>
        <Drawer title="Housing Assistance Menu" position="right">
          <div>
            <h3>Available Resources</h3>
            <ul>
              <li>Emergency Housing Assistance</li>
              <li>Rental Payment Programs</li>
              <li>Home Ownership Guidance</li>
              <li>Financial Counseling</li>
            </ul>
          </div>
        </Drawer>
      </Section>

      <Section>
        <SectionTitle>U-HSP Rules Engine Demo</SectionTitle>
        <Description>
          This demonstrates the Universal Homelessness Support Platform engine in action.
          It loads the London content pack and evaluates rules for a sample scenario.
        </Description>
        <EngineDemo />
      </Section>
    </AppContainer>
  );
}

export default App;
