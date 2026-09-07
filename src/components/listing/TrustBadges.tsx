import { Award, ShieldCheck, UserCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function TrustBadges({
  isVerified,
  insuranceVerified,
  certifications,
}: {
  isVerified: boolean;
  insuranceVerified: boolean;
  certifications: string[];
}) {
  if (!isVerified && !insuranceVerified && certifications.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isVerified && (
        <Badge variant="success" className="gap-1">
          <UserCheck className="h-3.5 w-3.5" aria-hidden />
          Identity verified
        </Badge>
      )}
      {insuranceVerified && (
        <Badge variant="success" className="gap-1">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
          Insured supplier
        </Badge>
      )}
      {certifications.map((cert) => (
        <Badge key={cert} variant="outline" className="gap-1">
          <Award className="h-3.5 w-3.5 text-accent" aria-hidden />
          {cert}
        </Badge>
      ))}
    </div>
  );
}
