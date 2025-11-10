{
  description = "TestApp development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20
            git
            # Add other tools as needed
          ];

          shellHook = ''
            echo "Welcome to TestApp development environment!"
            echo "Node.js version: $(node --version)"
            echo "npm version: $(npm --version)"
          '';
        };
      });
}