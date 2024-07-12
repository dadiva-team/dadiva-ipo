# Use the official .NET 8.0 SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the .csproj file and restore the dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy the remaining project files
COPY . ./

# Build the application
RUN dotnet publish -c Release -o out

# Use the official .NET runtime image to run the application
FROM mcr.microsoft.com/dotnet/aspnet:8.0-windowsservercore-ltsc2019 AS runtime

# Set the working directory inside the container
WORKDIR /app

# Copy the published output from the build step
COPY --from=build /app/out .

# Expose the port the application runs on
EXPOSE 7011
EXPOSE 5231
EXPOSE 5432
EXPOSE 9200

ENV DADIVA_CONNECTION_STRING="Host=host.docker.internal;Port=5432;Pooling=true;Database=postgres;User Id=postgres;Password=superuser;"
ENV DADIVA_ES_STRING="http://host.docker.internal:9200"

ENV ASPNETCORE_URLS="https://localhost:7011;http://localhost:5231"
ENV ASPNETCORE_ENVIRONMENT="Development"

ENV ASPNETCORE_Kestrel__Certificates__Default__Path=/root/.aspnet/https/aspnetapp.pfx
ENV ASPNETCORE_Kestrel__Certificates__Default__Password=password

# Set the entry point for the container
ENTRYPOINT ["dotnet", "DadivaAPI.dll"]