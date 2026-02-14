import { Footer } from '@workspace/ui/components/footer';

export default function FooterDemo() {
  return (
    <div className="w-full flex flex-col min-h-screen bg-background text-foreground">
      <div className="flex-1 flex items-center justify-center p-8 bg-muted/20">
        <p className="text-muted-foreground font-medium">Main application content goes here...</p>
      </div>
      <Footer />
    </div>
  );
}
