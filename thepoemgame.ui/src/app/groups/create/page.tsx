import { AuthGuard } from '@/auth/AuthGuard';

export default function CreateGroupPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Create a New Group</h1>
      </div>
    </AuthGuard>
  );
}