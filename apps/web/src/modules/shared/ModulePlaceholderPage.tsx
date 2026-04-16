import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DEFAULT_MODULE_ROUTE } from "@/app/navigation/modules";

type ModulePlaceholderPageProps = {
  title: string;
  summary: string;
  roadmapItems: string[];
};

export function ModulePlaceholderPage({
  title,
  summary,
  roadmapItems,
}: ModulePlaceholderPageProps) {
  return (
    <AppLayout breadcrumbs={["SwissKit", title]}>
      <div className="max-w-3xl mx-auto pt-10">
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Proximos entregaveis
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {roadmapItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <Button asChild variant="outline">
              <Link to={DEFAULT_MODULE_ROUTE}>Voltar para o modulo Financeiro</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
