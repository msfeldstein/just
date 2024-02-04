# just

> Just do the thing

`just` lets you run shell commands via natural language instead of needing to memorize or lookup arcane incantations.

```
$ just tell me my internal ip
> ipconfig getifaddr en0

$ just which process is using port 3000
> lsof -i :3000

$ just rename all the pngs in this folder to a numbered list
> for i in *.png; do mv "$i" "${i/\.png/$(printf "%03d" $(echo "$i" | sed 's/[^0-9]*//g'))}.png"; done
```

You'll need your own OpenAI key that you can enter the first time you run, or change it with `just --setKey`.
