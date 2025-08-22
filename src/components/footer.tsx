export function Footer() {
  return (
    <footer className="p-2 px-4 mx-4 rounded-t-lg border flex justify-between items-center backdrop-blur-sm">
      <nav className="flex gap-4">
        <a
          href="https://git.tvk.lol/nya/tvk-utils"
          className="underline text-accent-foreground"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source
        </a>
      </nav>
      <p className="text-muted-foreground text-sm">
        Made with ❤️ by{' '}
        <a
          href="https://github.com/nemvince"
          className="underline text-accent-foreground"
          target="_blank"
          rel="noopener noreferrer"
        >
          nemvince
        </a>
      </p>
    </footer>
  );
}
