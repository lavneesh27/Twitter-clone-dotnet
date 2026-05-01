IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [Messages] (
    [Id] nvarchar(64) NOT NULL,
    [SenderId] nvarchar(64) NOT NULL,
    [RecieverId] nvarchar(64) NOT NULL,
    [Text] nvarchar(max) NOT NULL DEFAULT N'',
    [CreatedAt] nvarchar(100) NOT NULL,
    [Attachment] nvarchar(max) NOT NULL DEFAULT N'',
    CONSTRAINT [PK_Messages] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Users] (
    [Id] nvarchar(64) NOT NULL,
    [UserName] nvarchar(100) NOT NULL,
    [FirstName] nvarchar(100) NOT NULL,
    [LastName] nvarchar(100) NOT NULL,
    [Email] nvarchar(256) NOT NULL,
    [Password] nvarchar(max) NOT NULL,
    [Dob] nvarchar(max) NULL,
    [Image] nvarchar(max) NULL,
    [Banner] nvarchar(max) NULL,
    [Bio] nvarchar(max) NULL,
    [Location] nvarchar(max) NOT NULL,
    [Website] nvarchar(max) NOT NULL,
    [CreatedAt] nvarchar(max) NULL,
    [Followers] nvarchar(max) NOT NULL,
    [Following] nvarchar(max) NOT NULL,
    [DefaultPrimaryColor] nvarchar(max) NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Tweets] (
    [Id] nvarchar(64) NOT NULL,
    [Content] nvarchar(max) NOT NULL,
    [Likes] nvarchar(max) NOT NULL,
    [UserId] nvarchar(64) NOT NULL,
    [CreatedAt] nvarchar(100) NOT NULL,
    [Image] nvarchar(max) NULL,
    CONSTRAINT [PK_Tweets] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Tweets_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [Bookmarks] (
    [Id] nvarchar(64) NOT NULL,
    [UserId] nvarchar(64) NOT NULL,
    [TweetId] nvarchar(64) NOT NULL,
    CONSTRAINT [PK_Bookmarks] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Bookmarks_Tweets_TweetId] FOREIGN KEY ([TweetId]) REFERENCES [Tweets] ([Id]),
    CONSTRAINT [FK_Bookmarks_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_Bookmarks_TweetId] ON [Bookmarks] ([TweetId]);
GO

CREATE UNIQUE INDEX [IX_Bookmarks_UserId_TweetId] ON [Bookmarks] ([UserId], [TweetId]);
GO

CREATE INDEX [IX_Tweets_UserId] ON [Tweets] ([UserId]);
GO

CREATE UNIQUE INDEX [IX_Users_Email] ON [Users] ([Email]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260423121339_InitialCreate', N'8.0.4');
GO

COMMIT;
GO

