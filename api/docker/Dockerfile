FROM gradle:8.13.0-jdk-alpine AS build

COPY --chown=gradle:gradle --chmod=755 api/settings.gradle /app/settings.gradle
COPY --chown=gradle:gradle --chmod=755 api/build.gradle /app/build.gradle
COPY --chown=gradle:gradle --chmod=755 api/src /app/src
COPY --chown=gradle:gradle --chmod=755 .git/ /.git/
WORKDIR /app

RUN gradle bootJar --no-daemon

FROM eclipse-temurin:21 AS run
RUN addgroup nonroot && useradd -g nonroot nonroot
COPY --from=build /app/build/libs/*.jar /app/app.jar
EXPOSE 8080

USER nonroot

CMD ["java", "-jar", "/app/app.jar"]
