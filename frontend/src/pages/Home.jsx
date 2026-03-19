import TextForm from '../components/editor/TextForm';

export default function Home({ mode, setMode, showAlert, gamification, user, isAuthenticated, subscription }) {
    return <TextForm mode={mode} setMode={setMode} showAlert={showAlert} gamification={gamification} user={user} isAuthenticated={isAuthenticated} subscription={subscription} />;
}
