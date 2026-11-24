# Gym oprema – interaktivni upravitelj popisa

Web stranica za vođenje popisa opreme za teretanu. Korisnik može dodavati, označavati i brisati opremu te pretraživati, filtrirati i sortirati popis bez ponovnog učitavanja stranice. Na početku se prikazuje šest zapisa. Podaci se čuvaju u JavaScript polju i vraćaju na početne vrijednosti nakon osvježavanja stranice.

## Svojstva jednog zapisa

- `id` – jedinstveni brojčani identifikator
- `title` – naziv opreme
- `category` – kategorija: utezi, dodaci za trening ili sprave
- `price` – cijena u eurima (broj)
- `bought` – logičko stanje (`true` = kupljeno, `false` = nije kupljeno)

## Pravila validacije

- Naziv, kategorija i cijena su obavezni.
- Naziv mora imati najmanje dva znaka nakon uklanjanja razmaka na početku i kraju.
- Naziv ne smije već postojati u popisu (ne razlikuju se velika i mala slova). Pravilo se provjerava metodom `setCustomValidity`.
- Kategorija se bira iz ponuđenog izbornika.
- Cijena mora biti cijeli broj od 1 do 1000 €.
- Poruke se pojavljuju pri pokušaju slanja obrasca i nestaju nakon ispravka polja.

## Struktura

- `index.html` – struktura stranice i obrazac
- `css/style.css` – oblikovanje stranice i stanja
- `js/podaci.js` – početni zapisi i kategorije
- `js/validacija.js` – funkcije za validaciju
- `js/main.js` – događaji, objekt stanja i iscrtavanje popisa

## Pokretanje

Zbog korištenja JavaScript modula projekt treba pokrenuti preko lokalnog poslužitelja.

U Visual Studio Codeu otvori mapu `upravitelj`, instaliraj ekstenziju Live Server, klikni desnom tipkom na `index.html` i odaberi **Open with Live Server**.

Alternativno, u terminalu unutar mape projekta pokreni:

```bash
python -m http.server 8000
```

Zatim otvori `http://localhost:8000` u pregledniku. Nisu potrebni dodatni paketi ni izgradnja projekta.

## Provjera rada

1. Pošalji prazan obrazac. Uz sva tri obavezna polja pojavljuju se poruke.
2. Ispravi naziv, kategoriju i cijenu jedno po jedno. Poruke nestaju.
3. Odaberi filtar „Dodaci za trening”, pretraži `rukavice` i dodaj Rukavice u toj kategoriji s cijenom 20 €. Brojač se promijeni, obrazac se resetira i fokus se vrati na naziv.
4. Obriši novi zapis, obriši pojam pretrage i označi drugu stavku kao kupljenu.
5. Upiši pojam koji ne postoji. Prikazuje se poruka o praznom stanju.
6. Provjeri i duplikat naziva (npr. `gurtne`), cijenu izvan raspona te oba smjera sortiranja po cijeni.
