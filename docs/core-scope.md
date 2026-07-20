# Core scope

Swiss Kit Core is a reusable web-system baseline, not a generic product.

Classify every capability before implementation:

- **Core:** generic, active baseline behavior maintained with the template.
- **Reference:** implemented example showing a repeatable pattern; not product functionality.
- **Optional:** useful generic capability that must be explicitly added, not enabled by default.
- **Partial:** Core behavior exists but intentionally covers only a limited slice.
- **Not implemented:** no runtime behavior exists.
- **Out of scope:** deliberately excluded from the baseline; do not infer it from adjacent features.

Current classifications are maintained in the [capability matrix](./current/capability-matrix.md). Files and notifications are Optional / Not implemented. Multi-tenancy is Out of scope / Not implemented.

Core must use neutral names, preserve the app/API/contracts boundaries, and avoid adding infrastructure such as tenant routing, storage, delivery services, queues, or external policy engines without explicit scope.
