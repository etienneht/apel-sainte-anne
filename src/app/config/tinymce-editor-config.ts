export const editorConfig = {
  height: 500,
  menubar: true,
  plugins: [
    'advlist',
    'autolink',
    'lists',
    'charmap',
    'preview',
    'anchor',
    'searchreplace',
    'visualblocks',
    'code',
    'fullscreen',
    'insertdatetime',
    'table',
    'help',
    'wordcount',
    'link',
  ] as string[], // Ajoutez une assertion de type pour garantir que c'est un tableau de chaînes
  content_css: './styles.scss', // Chemin du style personnalisé
  forced_root_block: '', // Permet d'éviter que tout soit automatiquement entouré d'un élément root
  force_br_newlines: true, // Force les sauts de ligne à utiliser <br>
  force_p_newlines: false, // Empêche les sauts de ligne automatiques d'utiliser <p>
  toolbar:
    'undo redo | formatselect | bold italic backcolor | ' +
    'alignleft aligncenter alignright alignjustify | ' +
    'bullist numlist outdent indent | image | link | removeformat | help ',
};
