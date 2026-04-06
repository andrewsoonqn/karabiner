import fs from "fs";
import { KarabinerRules } from "./types";
import {
  createHyperSubLayers,
  app,
  open,
  window,
  shell,
  shortcut,
} from "./utils";

const rules: KarabinerRules[] = [
  // Define the Hyper key itself
  {
    description: "Hyper Key (⌃⌥⇧⌘)",
    manipulators: [
      {
        description: "; -> Hyper Key",
        from: {
          key_code: "semicolon",
          modifiers: {
            optional: ["any"],
          },
        },
        to: [
          {
            set_variable: {
              name: "hyper",
              value: 1,
            },
          },
        ],
        to_after_key_up: [
          {
            set_variable: {
              name: "hyper",
              value: 0,
            },
          },
        ],
        to_if_alone: [
          {
            key_code: "semicolon",
          },
        ],
        type: "basic",
      },

      //        type: "basic",
      //        description: "Disable CMD + Tab to force Hyper Key usage",
      //        from: {
      //          key_code: "tab",
      //          modifiers: {
      //            mandatory: ["left_command"],
      //          },
      //        },
      //        to: [
      //          {
      //            key_code: "tab",
      //          },
      //        ],
      //      },
    ],
  },
  ...createHyperSubLayers({
    spacebar: open("raycast://extensions/raycast/navigation/switch-windows"),

    // b = "B"rowse (Left Hand Trigger) -> Actions on Right Hand
    b: {
      k: open("https://calendar.google.com"), // k = "Kalendar" (Right Hand)
      m: open("https://music.youtube.com"), // m = Music (Right Hand)
    },

    t: app("iTerm"),

    // o = "Open" applications (Right Hand Trigger) -> Actions on Left Hand
    o: {
      s: app("Passwords"), // s = "Security" (Left Hand) - Moved from 'p'
      b: app("Safari"), // b = Browser (Left Hand)
      f: app("Finder"), // f = Finder (Left Hand)
      c: open("raycast://extensions/raycast/system/open-camera"), // c = Camera (Left Hand)
      d: app("Discord"), // d = Discord (Left Hand)
      w: app("Whatsapp"), // w = Whatsapp (Left Hand)
      e: app("Mail"), // e = "Email" (Left Hand) - Moved from 'm'
      t: app("Telegram"), // t = Telegram (Left Hand)
    },

    // p = "Programming" (Right Hand Trigger) -> Actions on Left Hand
    // (These were already mostly good, 'p' is Right, targets are Left)
    p: {
      r: app("Rider"), // Left Hand
      e: app("Godot_mono"), // Left Hand ("Engine")
      g: app("GitHub Desktop"), // Left Hand
      c: app("Cursor"), // Left Hand
    },

    // s = "System" (Left Hand Trigger) -> Actions on Right Hand
    s: {
      m: shortcut("Deep Focus"), // m = "Mode" (Right Hand) - Moved from 'd'
      o: open("raycast://extensions/raycast/file-search/search-files"), // o = "Open file" (Right Hand) - Moved from 'f'

      // Shottr integration (All Right Hand)
      h: open("shottr://show"),
      j: open("shottr://grab/fullscreen"),
      k: open("shottr://grab/area"),
      l: open("shottr://grab/scrolling"),
      i: open("shottr://ocr"),
    },

    // w = "Window" (Left Hand Trigger) -> Actions on Right Hand
    // (Vim navigation is naturally Right Handed, so this is perfect)
    w: {
      slash: window("maximize"),
      p: window("almost-maximize"),
      h: window("left-half"),
      l: window("right-half"),
      j: window("bottom-half"),
      k: window("top-half"),
      period: window("next-display"),
      m: window("make-smaller"),
      comma: window("make-larger"),
      y: window("top-right-quarter"),
      u: window("bottom-right-quarter"),
      i: window("bottom-left-quarter"),
      o: window("top-left-quarter"),
    },

    // r = "Raycast" (Left Hand Trigger) -> Actions on Right Hand
    r: {
      k: open("raycast://extensions/thomas/color-picker/pick-color"), // k = "Kolor" (Right Hand) - Moved from 'c'
      i: open(
        "raycast://extensions/raycast/emoji-symbols/search-emoji-symbols"
      ), // i = "Icon" (Right Hand) - Moved from 'e'
      p: open("raycast://extensions/raycast/raycast/confetti"), // p = "Party" (Right Hand)
      h: open(
        "raycast://extensions/raycast/clipboard-history/clipboard-history"
      ), // h = History (Right Hand)
      l: open(
        "raycast://extensions/cjdenio/two-factor-authentication-code-generator/index"
      ), // l = "Login" (Right Hand) - Moved from 'a'
      n: open("raycast://extensions/raycast/system/quit-all-apps"), // n = "Nuke/No more" (Right Hand) - Moved from 'q'
    },

    // c = "Cheatsheet" (Left Hand Trigger) -> Actions on Right Hand
    c: {
      j: open("raycast://extensions/raycast/snippets/search-snippets"), // j = "Jot/Just text" (Right Hand) - Moved from 's'
      y: open("~/Documents/nus-calendar.pdf"), // A(Y)
      v: open("~/Documents/The Ultimate Vim Command Cheat Sheet.pdf"),
      l: open("~/karabiner/layers-cheat-sheet.html"),
    },
  }),
  {
    description: "Enter acts as ctrl when held",
    manipulators: [
      {
        type: "basic",
        from: {
          key_code: "return_or_enter",
          modifiers: { optional: ["any"] },
        },
        to: [
          {
            key_code: "right_control",
          },
        ],
        to_if_alone: [
          {
            key_code: "return_or_enter",
          },
        ],
      },
    ],
  },
  {
    description: "Spacebar acts as option when held",
    manipulators: [
      {
        type: "basic",
        from: {
          key_code: "spacebar",
          modifiers: { optional: ["any"] },
        },
        to_if_alone: [
          {
            "key_code": "spacebar"
          }
        ],
        to_if_held_down: [
          {
            "key_code": "left_option",
          }
        ],
        parameters: {
          "basic.to_if_held_down_threshold_milliseconds": 150,
        },
        // to: [
        //   {
        //     key_code: "left_option",
        //   },
        // ],
        // to_if_alone: [
        //   {
        //     key_code: "spacebar",
        //   },
        // ],
      },
    ],
  },
  {
    description: "Change CAPS to ESC, and CTRL when held",
    manipulators: [
      {
        type: "basic",
        from: {
          key_code: "caps_lock",
          modifiers: { optional: ["any"] },
        },
        to_if_alone: [
          {
            key_code: "escape",
          },
        ],
        to: [
          {
            key_code: "left_control",
          },
        ],
      },
    ],
  },
  {
    description: "F19 opens keymap image",
    manipulators: [
      {
        type: "basic",
        from: {
          key_code: "f19",
          modifiers: { optional: ["any"] },
        },
        to: open("~/Documents/Keymaps/my_keymap-main.png").to,
      },
    ],
  },
];

fs.writeFileSync(
  "karabiner.json",
  JSON.stringify(
    {
      global: {
        show_in_menu_bar: false,
      },
      profiles: [
        {
          name: "Default",
          complex_modifications: {
            rules,
          },
        },
      ],
    },
    null,
    2
  )
);
