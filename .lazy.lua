-- Lazy.nvim plugin configuration for Office project
-- This file contains ONLY project-specific tooling requirements
-- Users should configure their own LSP, completion, file explorers, etc.
--
-- Usage:
-- Add to your lazy.nvim setup to ensure project-specific tools are available

return {
  -- TypeScript/JavaScript LSP
  {
    "neovim/nvim-lspconfig",
    optional = true,
    opts = {
      servers = {
        ts_ls = {
          root_dir = function(...)
            return require("lspconfig.util").root_pattern("package.json", "tsconfig.json")(...)
          end,
        },
      },
    },
  },

  -- Biome LSP for linting and formatting
  -- Note: Biome support in nvim-lspconfig may vary
  {
    "neovim/nvim-lspconfig",
    optional = true,
    opts = {
      servers = {
        biome = {
          root_dir = function(...)
            return require("lspconfig.util").root_pattern("biome.json", "package.json")(...)
          end,
        },
      },
    },
  },

  -- Conform.nvim formatter configuration for Biome
  {
    "stevearc/conform.nvim",
    optional = true,
    opts = {
      formatters_by_ft = {
        typescript = { "biome" },
        typescriptreact = { "biome" },
        javascript = { "biome" },
        javascriptreact = { "biome" },
        json = { "biome" },
      },
      formatters = {
        biome = {
          command = "bunx",
          args = { "@biomejs/biome", "format", "--stdin-file-path", "$FILENAME" },
          stdin = true,
        },
      },
    },
  },

  -- nvim-lint configuration for Biome
  {
    "mfussenegger/nvim-lint",
    optional = true,
    opts = {
      linters_by_ft = {
        typescript = { "biome" },
        typescriptreact = { "biome" },
        javascript = { "biome" },
        javascriptreact = { "biome" },
      },
      linters = {
        biome = {
          cmd = "bunx",
          args = { "@biomejs/biome", "lint", "--stdin-file-path", vim.api.nvim_buf_get_name(0) },
          stdin = true,
          stream = "stdout",
          ignore_exitcode = true,
        },
      },
    },
  },

  -- Treesitter: Ensure required parsers are installed
  {
    "nvim-treesitter/nvim-treesitter",
    optional = true,
    opts = function(_, opts)
      opts.ensure_installed = opts.ensure_installed or {}
      vim.list_extend(opts.ensure_installed, {
        "typescript",
        "tsx",
        "javascript",
        "json",
        "markdown",
        "markdown_inline",
      })
    end,
  },
}
