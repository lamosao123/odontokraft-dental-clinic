# Odontokraft Dental Clinic

Shared books for the Dumanjug and Moalboal clinics. Daily sales, costs, electric and water bills, and staff pay stay in one book. A save shows up on every phone that has the clinic open.

## Run

```bash
npm install
npm run dev
```

The app opens on port 8080. With no database configured it keeps the book in a local Postgres. Set `DATABASE_URL` when every computer should share the same book.

## Staff

- Dumanjug: Doc Donna, Maam Elie
- Moalboal: Doc Keith, Maam Jo, Joy, Rhea

Salary and commission are typed in by hand each day.

## Files

More has **Export sales**, **Export expenses**, **Import sales**, and **Import costs**. Import only accepts the CSV this clinic exported. A file imported twice does not double the numbers.
