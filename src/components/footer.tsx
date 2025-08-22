export function Footer() {
  return (
    <footer className="p-2 px-4 mx-4 rounded-t-lg border flex justify-between items-center backdrop-blur-sm">
      <p className="text-muted-foreground text-sm">
        Project so cool it makes you want to hire me?{' '}
        <a
          href="https://linkedin.com/in/nemvince"
          className="underline text-accent-foreground"
          target="_blank"
          rel="noopener noreferrer"
        >
          Let's connect on LinkedIn!
        </a>
      </p>
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
