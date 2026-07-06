FROM node:20-bookworm

# Install nargo
RUN curl -L https://github.com/noir-lang/noirup/raw/main/install | NARGO_VERSION=1.0.0-beta.1 /bin/bash
ENV PATH="/root/.nargo/bin:$PATH"

# Install bb (Barretenberg)
RUN curl -L https://raw.githubusercontent.com/AztecProtocol/aztec-packages/master/barretenberg/bbup/install | bash
RUN ~/.bb/bbup --version 0.76.4
ENV PATH="/root/.bb:$PATH"

WORKDIR /app

# Copy server package files
COPY server/package*.json ./server/
RUN cd server && npm install

# Copy circuits and server source
COPY circuits/ ./circuits/
COPY server/ ./server/

EXPOSE 3002
CMD ["node", "--import", "tsx", "server/prover.ts"]
