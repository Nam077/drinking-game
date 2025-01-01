export const metadata = {
  title: 'Không làm thì uống, không say không về',
  description: 'Không làm thì uống, không say không về',
};

import CardManager from './components/CardManager';

export default function Home() {
  return (
    <main className="min-h-screen">
      <CardManager />
    </main>
  );
}
