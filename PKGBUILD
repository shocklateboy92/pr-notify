# This is an example PKGBUILD file. Use this as a start to creating your own,
# and remove these comments. For more information, see 'man PKGBUILD'.
# NOTE: Please fill out the license field for your package! If it is unknown,
# then please put 'unknown'.

# Maintainer: Your Name <devel@lasath.org>
pkgname=pr-notify
pkgver=1.0
pkgrel=1
pkgdesc="My Kargos script to check for PRs in Azure Devops"
arch=('any)
url="https://github.com/shocklateboy92/pr-notify"
license=('MIT')
groups=('kargos')
depends=('nodejs')
makedepends=('yarn')
checkdepends=()
optdepends=()
provides=()
conflicts=()
replaces=()
backup=()
options=()
install=
changelog=
source=()
noextract=()
md5sums=()
validpgpkeys=()

prepare() {
}

build() {
	yarn build --mode=production
    cp dist/main.js pkg/lib/js/pr-notify.js
}

package() {
    # The -rT is to ensure all the hidden files are copied,
    # without creating a subdirectory in DEST_DIR
    # The -L is to follow symlinks, rather than copying them.
    cp -rvTL pkg "${pkgdir}/usr/local";
}
