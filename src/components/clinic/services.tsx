import { useState } from "react";
import { Plus } from "lucide-react";
import { num, peso, round2, uid } from "@/lib/finance/format";
import { useClinic } from "@/lib/finance/store";
import type { Service } from "@/lib/finance/types";
import {
  EmptyState,
  ErrorNote,
  Field,
  GhostButton,
  PageHead,
  PrimaryButton,
  Sheet,
  fieldClass,
} from "@/components/clinic/ui";

type Draft = { id?: string; name: string; price: string; active: boolean };

export function Services() {
  const data = useClinic();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState("");
  const [blocked, setBlocked] = useState(false);

  function open(service?: Service) {
    setError("");
    setBlocked(false);
    setDraft(
      service
        ? { id: service.id, name: service.name, price: String(service.price), active: service.active }
        : { name: "", price: "", active: true },
    );
  }

  function save() {
    if (!draft) return;
    const name = draft.name.trim();
    const price = round2(num(draft.price));
    if (!name) {
      setError("Name the procedure.");
      return;
    }
    if (price < 0) {
      setError("Price cannot be negative.");
      return;
    }
    data.saveService({ id: draft.id ?? uid("svc"), name, price, active: draft.active });
    setDraft(null);
  }

  return (
    <div>
      <PageHead
        title="Services"
        subtitle="Fee guide. Prices are a reference for the clinic."
        action={
          <PrimaryButton onClick={() => open()}>
            <Plus className="size-4" />
            Add
          </PrimaryButton>
        }
      />
      {data.services.length === 0 ? (
        <EmptyState title="No procedures yet" body="Add consultation, cleaning, and the rest of the fee guide." action={<PrimaryButton onClick={() => open()}>Add a service</PrimaryButton>} />
      ) : (
        <ul className="divide-y divide-line rounded-3xl border border-line">
          {data.services.map((service) => (
              <li key={service.id}>
                <button type="button" className="w-full px-4 py-3 text-left" onClick={() => open(service)}>
                  <span className="flex items-baseline justify-between gap-3">
                    <span className={service.active ? "font-medium" : "text-muted"}>{service.name}</span>
                    <span className="tabular-nums">{peso(service.price)}</span>
                  </span>
                  <span className="mt-1 block text-xs text-muted">{service.active ? "On the list" : "Not in use"}</span>
                </button>
              </li>
            ))}
        </ul>
      )}

      <Sheet
        open={!!draft}
        title={draft?.id ? "Edit service" : "New service"}
        onClose={() => setDraft(null)}
        footer={
          <div className="flex gap-2">
            {draft?.id ? (
              <GhostButton
                onClick={() => {
                  if (!draft.id) return;
                  if (!data.removeService(draft.id)) {
                    setBlocked(true);
                    return;
                  }
                  setDraft(null);
                }}
              >
                Delete
              </GhostButton>
            ) : null}
            <PrimaryButton className="flex-1" onClick={save}>
              Save service
            </PrimaryButton>
          </div>
        }
      >
        {draft ? (
          <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); save(); }}>
            <Field label="Procedure">
              <input className={fieldClass} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
            </Field>
            <Field label="Fee">
              <input className={fieldClass} inputMode="decimal" value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} />
            </Field>
            <label className="flex h-11 items-center gap-3 text-sm">
              <input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} />
              Offer on new sales
            </label>
            {error ? <ErrorNote>{error}</ErrorNote> : null}
            {blocked ? <ErrorNote>Past visits use this procedure, so it cannot be deleted. Hide it instead.</ErrorNote> : null}
          </form>
        ) : null}
      </Sheet>
    </div>
  );
}
