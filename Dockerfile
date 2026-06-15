
# Use a multi-stage build for smaller final image
# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Build the application
RUN mvn clean package -DskipTests -Dmaven.javadoc.skip=true

# Stage 2: Run
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
# Copy the built jar file from the builder stage
COPY --from=builder /app/target/*.jar app.jar
# Expose port 8080
EXPOSE 8080
# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
