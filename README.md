# filescraper

CLI utility to extract all image URLs from text files in a directory and download them into a destination folder.  Also has optional capability of replacing all host URLs in the same text files to a new host string.

#### **Version**
The version of this utility is based on the `package.json`.

```bash
$ filescraper -v
```

#### **Arguments**
- `<rootPath>`: **Required**. Specifies the root directory to begin scanning files.

#### **Options**
- `-d, --directory <path>`: **Optional**. Specifies the destination directory to place downloaded files.
- `-r, --replace-host <hostname>`: **Optional**. Replaces host URLs in files with the provided hostname string.

#### **Examples**

```bash
# Basic usage with a root path
filescraper /some/root/directory

# Specify a destination directory for downloaded files
filescraper /some/root/directory --directory /path/to/save/files

# Replace hostname in URLs with the provided hostname string
filescraper /some/root/directory --replace-host example.com
```