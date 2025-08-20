import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComplaintForm from '@/components/global/complaintForm/ComplaintForm';
import AdminDashboard from '@/components/global/AdminDashboard/AdminDashboard';
import { getComplaints } from "@/lib/actions/actions";
import { getSession } from "@/lib/session";
import { FileText, Shield } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();
  const complaints = session?.user?.role === 'admin' ? await getComplaints() : [];

  if (!session?.user) {
    redirect('/login');
  }

  const defaultTab = session.user.role === 'admin' ? 'admin' : 'submit';

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary font-headline">Complaint Central</h1>
        <p className="text-muted-foreground mt-2 font-body">Your one-stop solution for issue resolution.</p>
      </header>
      <main className="w-full max-w-6xl">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className={`grid w-full ${session.user.role === 'admin' ? 'grid-cols-2' : 'grid-cols-1'} h-12`}>
            <TabsTrigger value="submit" className="h-full">
              <FileText className="mr-2 h-5 w-5" />
              Submit Complaint
            </TabsTrigger>
            {session.user.role === 'admin' && (
              <TabsTrigger value="admin" className="h-full">
                <Shield className="mr-2 h-5 w-5" />
                Admin Dashboard
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="submit" className="mt-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline">Submit a New Complaint</CardTitle>
                <CardDescription>Please fill out the form below to submit your complaint.</CardDescription>
              </CardHeader>
              <CardContent>
                <ComplaintForm />
              </CardContent>
            </Card>
          </TabsContent>
          {session.user.role === 'admin' && (
            <TabsContent value="admin" className="mt-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline">Complaint Management</CardTitle>
                  <CardDescription>View, manage, and resolve all submitted complaints.</CardDescription>
                </CardHeader>
                <CardContent>
                  <AdminDashboard complaints={complaints} />
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </main>
      <footer className="text-center mt-12 text-muted-foreground text-sm">
        <p>Built with Next.js, MongoDB.</p>
      </footer>
    </div>
  );
}
