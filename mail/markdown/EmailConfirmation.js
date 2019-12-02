module.exports = function (object) {
  return `<body class="bg-gray-200 p-20 text-center">
    <style>
      @import 'https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css'
    </style>
    <div class="bg-white p-10 rounded-sm shadow mx-auto">
      <h1 class="font-bold text-3xl">Please confirm your email</h1>
      <a href="${object.link}" class="bg-blue text-white px-2 py-1 shadow-lg" target="_blank">Confirm Email</a>
    </div>
  </body>`
}