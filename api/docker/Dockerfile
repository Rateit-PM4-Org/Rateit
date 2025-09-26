FROM gradle:9.1.0-jdk-alpine AS build

COPY --chown=root:root --chmod=744 api/settings.gradle /app/settings.gradle
COPY --chown=root:root --chmod=744 api/build.gradle /app/build.gradle
COPY --chown=root:root --chmod=744 api/src /app/src
COPY --chown=root:root --chmod=744 .git/ /.git/
WORKDIR /app

RUN gradle bootJar --no-daemon

FROM eclipse-temurin:25-jre-alpine AS run
COPY --from=build /app/build/libs/*.jar /app/app.jar
EXPOSE 8080

CMD ["java", "-jar", "/app/app.jar"]
