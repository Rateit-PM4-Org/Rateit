FROM gradle:8.12.1-jdk-alpine AS build

COPY --chown=gradle:gradle --chmod=755 settings.gradle /app/settings.gradle
COPY --chown=gradle:gradle --chmod=755 build.gradle /app/build.gradle
COPY --chown=gradle:gradle --chmod=755 src /app/src
WORKDIR /app

RUN gradle bootJar --no-daemon

FROM eclipse-temurin:21 AS run
RUN addgroup nonroot && useradd -g nonroot nonroot
COPY --from=build /app/build/libs/*.jar /app/app.jar
EXPOSE 8080

USER nonroot

CMD ["java", "-jar", "/app/app.jar"]
